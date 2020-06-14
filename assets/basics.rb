def cls
 1.upto(40) { puts "" }
end

def create(newclass)
  
  arg_string = '#{arg.to_s}'
  init_params_string = '#{init_params}'
  
  s= <<-END
 	  class #{newclass.to_s}
 	    def self.with(*args)
 	      for arg in args
 	        class_eval <<-DONE
 	          def #{arg_string}=(value)
 	            @_#{arg_string} = value
 	          end
 	          def #{arg_string}
 	            @_#{arg_string}
 	          end
 	        DONE
 	      end # end for
 	      # create def initialize
 	      init_params = args.collect { |arg| arg.to_s } * ", "
 	      init_meth = "" 
 	      init_meth << "def initialize(#{init_params_string})\n"
 	      for arg in args
 	        init_meth << "@_#{arg_string} = #{arg_string}\n"
 	      end
 	      init_meth << "end"
 	      class_eval init_meth
 	      self
 	    end
	  end
	END
  eval s
  eval(newclass.to_s)
end